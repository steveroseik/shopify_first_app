import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { Button, Card, Form, Layout, List, Page } from "@shopify/polaris";
import { access } from "fs";
import React from "react";
import { apiVersion, authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const order = new admin.rest.resources.Order({ session });
    // const transaction = new admin.rest.resources.Transaction({
    //   session,
    // });
    const ayHaga = await request.formData();

    console.log(ayHaga.get("username"));

    // transaction.processed_at;
    console.log("HEREE ISAA");
    order.email = "foo@example.com";
    order.fulfillment_status = "fulfilled";
    order.total_price = "88.8";
    order.currency = "EGP";
    order.line_items = [
      {
        variant_id: "8410490667263",
        quantity: 1,
      },
    ];

    const data = await order.save({
      update: true,
    });

    console.log(data);

    return null;
  } catch (error) {
    console.error("Error in action:", error);
    throw error;
  }
};

const CreateOrders = () => {
  //   const submit = useSubmit();
  //   const actionData = useActionData<typeof action>();

  //   const generateAyHaga = () => submit({ replace: true, method: "POST" });
  //   //   console.log(actionData, "actionData");

  return (
    <Page>
      <Layout.Section>
        <Card>
          <h1>Create Orders</h1>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <Form method="post" action="/my-form" onSubmit={() => action}>
            {/* Form fields */}
            <input type="text" name="username" />
            <button type="submit">Submitt</button>
          </Form>
        </Card>
      </Layout.Section>
    </Page>
  );
};

export default CreateOrders;
