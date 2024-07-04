import React, { useState } from 'react';
import { DatatypeTag } from './../uicomp/tag';

const SchemaProperty = ({ name, property }: {name: string, property: any}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const getType = (property: any) => {
    if (property.type === 'array' && property.items) {
      return `array of ${property.items.type}s`;
    }
    return property.type;
  };

  const renderProperty = () => {
    if (property.type === 'object' && property.properties) {
      return (
        <div className="ml-4">
          <p><DatatypeTag label={getType(property)} /></p>
          <p>{property.description}</p>
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
          <p>{property.description}</p>
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
            <p>{property.description || ''}</p>
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
const SchemaObject = ({ schema }: {schema: any}) => {
  return (
    <table className="min-w-full border-collapse rounded-md block md:table">
      <thead className="block md:table-header-group">
        <tr className="border md:table-row">
          <th className="block md:table-cell border px-4 py-2">Attribute</th>
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
export const JSONSchemaRenderer = ({ schema }: {schema: any}) => {
  return (
    <div className="py-4">
      <SchemaObject schema={schema.properties} />
    </div>
  );
};
