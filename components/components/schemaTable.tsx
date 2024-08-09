import React, { useState } from 'react';
import { DatatypeTag } from './../uicomp/tag';

const SchemaProperty = ({ name, property }: {name: string, property: any}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const parseLinks = (text: string) => {
    const linkPattern = /\[(.*?)\]\((.*?)\)/g;
    return text.replace(linkPattern, '<a href="$2" class="underline">$1</a>');
  };
  
  const getType = (property: any) => {
    if (property.type === 'array' && property.items) {
        const enumValues = property.items.enum ? ` [${property.items.enum.join(', ')}]` : '';
        return `array of ${property.items.type}s with enum: ${enumValues}`;
      }
    return property.type;
  };

  const renderProperty = () => {
    const descriptionHtml = property.description ? parseLinks(property.description) : '';

    if (property.type === 'object' && property.properties) {
      return (
        <div className="ml-4">
          <p><DatatypeTag label={getType(property)} /></p>
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          <button
            className="border border-slate-600 rounded-md px-3 py-2 text-xs"
            onClick={toggleExpand}
          >
            {isExpanded ? 'Hide child attributes' : 'Show child attributes'}
          </button>
          {isExpanded && (
            <SchemaObject schema={property.properties} />
          )}
        </div>
      );
    } else if (property.type === 'array' && property.items.type === 'object') {
      return (
        <div className="ml-4">
          <p><DatatypeTag label={getType(property)} /></p>
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          <button
            className="border border-slate-600 rounded-md px-3 py-2 text-xs"
            onClick={toggleExpand}
          >
            {isExpanded ? 'Hide child attributes' : 'Show child attributes'}
          </button>
          {isExpanded && (
            <>
            <SchemaObject schema={property.items.properties} />
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="ml-4">
            <p><DatatypeTag label={getType(property)} /></p>
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        </div>
      );
    }
  };

  return (
    <tr>
      <td className="border px-4 py-2 font-bold">{name}</td>
      <td className="border px-4 py-2">{renderProperty()}</td>
    </tr>
  );
};

// Component to render the schema object
const SchemaObject = ({ schema, type }: {schema: any, type?: string}) => {
  return (
    <table className="min-w-full border-collapse rounded-md block md:table">
      <thead className="block md:table-header-group">
        <tr className="border md:table-row">
          <th className="block md:table-cell border px-4 py-2">{type && type == "schema" ? "Attribute" : type}</th>
          <th className="block md:table-cell border px-4 py-2">Description</th>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {Object.keys(schema).map((key) => (
          <SchemaProperty key={key} name={key} property={schema[key]} />
        ))}
      </tbody>
    </table>
  );
};

// Main component to render the JSON schema
export const JSONSchemaRenderer = ({ schema, type = "schema" }: {schema: any, type: string}) => {
  return (
    <div className="py-4">
      <SchemaObject schema={schema.properties} type={type} />
    </div>
  );
};

/** 
 
 schema={
    properties: {
        available: {
            type: "array",
            description: "Available funds that you can transfer or pay out automatically by Stripe or explicitly through the Transfers API or Payouts API. You can find the available balance for each currency and payment type in the source_types property.",
            items: {
                type: "object",
                properties: {
                    amount: { type: "integer", description: "Balance amount." },
                    currency: { type: "string", description: "Three-letter ISO currency code, in lowercase. Must be a supported currency."}
                }
            }
        },
        pending: {
            type: "array",
            description: "Funds that aren't available in the balance yet. You can find the pending balance for each currency and each payment type in the source_types property.",
            items: {
              type: "object",
              properties: {
                amount: { type: "integer", description: "Balance amount." },
                currency: { type: "string", description: "Three-letter ISO currency code, in lowercase. Must be a supported currency." },
                source_types: {
                  type: "object",
                  properties: {
                    bank_account: { type: "integer", description: "Amount for bank account." },
                    card: { type: "integer", description: "Amount for card." },
                    fpx: { type: "integer", description: "Amount for FPX." }
                  }
                }
              }
            }
          }
    }
}
*/
