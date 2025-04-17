
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.13.0?target=deno";

serve(async (req) => {
  try {
    // Get the stripe signature from the headers
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response("Webhook Error: No Stripe signature", { status: 400 });
    }

    // Get the raw body
    const body = await req.text();
    
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
      apiVersion: "2023-10-16",
    });

    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") as string
      );
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoice_id;
      
      if (!invoiceId) {
        return new Response("Webhook Error: No invoice ID in metadata", { status: 400 });
      }

      // Create Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Update invoice status to paid
      await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", invoiceId);

      // Optional: Trigger an external webhook (e.g., n8n workflow)
      const n8nWebhookBase = Deno.env.get("VITE_N8N_WEBHOOK_BASE");
      if (n8nWebhookBase) {
        try {
          await fetch(`${n8nWebhookBase}/invoice-paid`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId }),
          });
        } catch (error) {
          console.error("Error triggering n8n webhook:", error);
        }
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
});
