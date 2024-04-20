import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Card, Layout, List, Page } from "@shopify/polaris";
import { access } from "fs";
import React from "react";
import { apiVersion, authenticate } from "~/shopify.server";

export const query = `
{
  products(first: 10){
    edges{
          node{
              id
              handle
              title
              description
            	priceRangeV2{
                minVariantPrice{ 
                  amount
                  currencyCode
                }
              }
          	}
        }
        pageInfo {
            hasNextPage,
          	endCursor
        }
	}
}
`;

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const { shop, accessToken } = session;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": accessToken!,
        },
        body: query,
      },
    );

    console.log(`response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();

      const {
        data: {
          products: { edges },
        },
      } = data;

      return edges;
    }

    return null;
  } catch (e) {
    console.log(e);
  }
};

const Collections = () => {
  const collections: any = useLoaderData();
  console.log(collections, "collections");

  return (
    <Page>
      <Layout.Section>
        <Card>
          <h1>Hello World</h1>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <List type="bullet" gap="loose">
            {collections.map((edge: any) => {
              const { node: item } = edge;
              return (
                <List.Item key={item.id}>
                  <h2>{item.title}</h2>
                  <h2>{item.description}</h2>
                </List.Item>
              );
            })}
          </List>
        </Card>
      </Layout.Section>
    </Page>
  );
};

export default Collections;
