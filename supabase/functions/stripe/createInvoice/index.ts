
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.13.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const { invoiceId } = await req.json();
    
    // Fetch invoice and related data
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers (
          id,
          full_name,
          email
        )
      `)
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), { 
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
      apiVersion: "2023-10-16",
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.customers?.email,
      line_items: [
        {
          price_data: {
            currency: invoice.currency || "usd",
            product_data: { 
              name: `Invoice #${invoice.id.substring(0, 8)}`,
              description: `Payment for services`
            },
            unit_amount: invoice.amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/invoicing?success=true`,
      cancel_url: `${req.headers.get("origin")}/invoicing?cancelled=true`,
      metadata: { invoice_id: invoice.id, business_id: invoice.business_id },
    });

    // Update invoice with checkout session information
    await supabase
      .from("invoices")
      .update({ 
        status: "sent", 
        stripe_checkout_session_id: session.id, 
        stripe_checkout_url: session.url 
      })
      .eq("id", invoice.id);

    return new Response(JSON.stringify({ url: session.url }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
