import { useState } from "react"
import { HTTPResponseCodes } from "@utils/http"
import { Tabs, Tab } from "@components/uicomp/tabbar"
import { ChevronRight } from "@components/icons-alt/chevron-right"
import cn from "classnames"

const resolveNestedRefs = (schemaObj, schemas) => {
  if (!schemaObj) return schemaObj;

  if (schemaObj.$ref) {
      return resolveRef(schemaObj.$ref, schemas);
  }
  if (schemaObj?.properties?.$ref) {
      return resolveRef(schemaObj?.properties?.$ref, schemas);
  }

  if (schemaObj.type === 'object' && schemaObj.properties) {
      Object.keys(schemaObj.properties).forEach((key) => {

          const prop = schemaObj.properties[key];

          if (prop.$ref) {
            schemaObj.properties[key] = resolveRef(prop.$ref, schemas);
          } else {
            schemaObj.properties[key] = resolveNestedRefs(prop, schemas);
          }
      });
  }

  if (schemaObj.type === 'array' && schemaObj.items) {
    schemaObj.items = resolveNestedRefs(schemaObj.items, schemas);
  }

  return schemaObj;
};

const resolveRef = (ref, schemas, visited = new Set()) => {
  if (typeof ref !== "string") return ref;

  if (!ref.startsWith('#/components/schemas/')) {
    throw new Error(`Unsupported $ref format: ${ref}`);
  }

  const refPath = ref.replace(/^#\/components\/schemas\//, "");
  if (visited.has(refPath)) {
    throw new Error(`Circular reference detected: ${refPath}`);
  }

  const schema = schemas[refPath];
  if (!schema) {
    return ref;
  }

  visited.add(refPath);

  if (schema.$ref) {
    return resolveRef(schema.$ref, schemas, visited);
  }

  if (schema.type === 'object' && schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      const prop = schema.properties[key];
      if (prop.$ref) {
        schema.properties[key] = resolveRef(prop.$ref, schemas, visited);
      } else if (prop.type === 'object' && prop.properties) {
        schema.properties[key] = resolveRef(prop, schemas, visited);
      } else if (prop.type === 'array' && prop.items.$ref) {
        schema.properties[key].items = resolveRef(prop.items.$ref, schemas, visited);
      }
    });
  }

  if (schema.type === 'array' && schema.items && schema.items.$ref) {
    schema.items = resolveRef(schema.items.$ref, schemas, visited);
  }

  visited.delete(refPath);
  return schema;
};

export const getColorClassName = (method) => {
  switch (method) {
    case "GET": return "bg-green-100 text-green-600"
    case "HEAD": return "bg-fuchsia-100 text-fuchsia-600"
    case "POST": return "bg-sky-100 text-sky-600"
    case "PUT": return "bg-amber-100 text-amber-600"
    case "DELETE": return "bg-rose-100 text-rose-600"
    case "CONNECT": return "bg-violet-100 text-violet-600"
    case "OPTIONS": return "bg-neutral-100 text-neutral-600"
    case "TRACE": return "bg-indigo-100 text-indigo-600"
    case "PATCH": return "bg-orange-100 text-orange-600"
  }
}

export const getResponseColorClassName = (code) => {
  if (code < 300) {
    return "bg-green-500"
  } else if (code < 400) {
    return "bg-orange-500"
  } else {
    return "bg-rose-500"
  }
}

export const getResponseBGColorClassName = (code) => {
  if (code < 300) {
    return "bg-green-50"
  } else if (code < 400) {
    return "bg-orange-50"
  } else {
    return "bg-rose-50"
  }
}

export const ResponseTag = ({ code }) => {
  return <div className={`${getResponseBGColorClassName(code)} p-2 w-min rounded-md not-prose flex flex-row gap-2 items-center whitespace-nowrap`}>
      <div className={`${getResponseColorClassName(code)} rounded-full w-2 h-2 flex-none`}/>
      <p className="text-xs font-bold">{code}: {HTTPResponseCodes[code]}</p>
    </div>
}

export const Badge = ({ method }) => {
  return <span className={`${getColorClassName(method)} font-medium rounded-full px-2 py-1 text-xs w-min select-none`}>{ method }</span>
}

const isObject = (obj) => obj && typeof obj === 'object' && !Array.isArray(obj);

const renderExample = (example) => {

  if (typeof example === 'object') {
    return <pre>{JSON.stringify(example, null, 2)}</pre>;
  }
  return <span className="font-mono text-xs overflow-hidden overflow-ellipsis block w-full">{example}</span>;
};


const ObjectTypeFormatter = ({ typeinfo }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="overflow-x-auto flex flex-col gap-2 divide-y divide-neutral-100">
      {typeinfo && Object.keys(typeinfo).map(k => (
        <div key={k} className="py-2">
          <div>
            <span className="font-[700]">{k}</span>
            { typeinfo[k].required && (
              <span className="text-red-500">*</span>
            )}
            <span className="ml-4 text-xs">{typeinfo[k].type}</span>
          </div>
          {typeinfo[k].description && (
            <p className="text-neutral-500 text-xs">{typeinfo[k].description}</p>
          )}
          {typeinfo[k].example && (
            <div>
              <p className="mb-2 text-neutral-500 text-xs">Example:</p>
              <div className="bg-slate-50 text-slate-500 p-2 rounded-md font-mono text-xs whitespace-pre-wrap">
                {renderExample(typeinfo[k].example)}
              </div>
            </div>
          )}
          {typeinfo[k].properties && (
            <>
              <div className="w-min flex flex-row items-center cursor-pointer hover:opacity-80" onClick={() => setOpen(!isOpen)}>
                {typeinfo && (
                  <div className="flex flex-row items-center whitespace-nowrap mt-0.5 text-xs border rounded-full px-2 bg-neutral-50 text-neutral-500 transition">
                    {isOpen ? 'Hide child attributes' : 'Show child attributes'}
                  </div>
                )}
              </div>
              {isOpen && (
                <div className="mt-2 pb-2 px-2 border border-neutral-100 rounded-md">
                  <ObjectTypeFormatter typeinfo={typeinfo[k].properties} />
                </div>
              )}
            </>
          )}
          {typeinfo[k].items && (
            <TypeFormatter type={typeinfo[k].type} typeinfo={typeinfo[k].items} />
          )}
        </div>
      ))}
    </div>
  );
};

const TypeFormatter = ({ type, typeinfo }) => {
  const [isOpen, setOpen] = useState(false);
  
  if (type === 'array') {
    return (
      <div>
        <div className="w-min flex flex-row items-center cursor-pointer hover:opacity-80" onClick={() => setOpen(!isOpen)}>
          {typeinfo && (
            <div className="flex flex-row items-center whitespace-nowrap mt-0.5 text-xs border rounded-full px-2 bg-neutral-50 text-neutral-500 transition">
              {isOpen ? 'Hide child attributes' : 'Show child attributes'}
            </div>
          )}
        </div>
        {isOpen && (
          <div className="mt-2 pb-2 px-2 border border-neutral-100 rounded-md">
            {typeinfo?.type === 'object' && (
              <>
                <span className="text-xs text-neutral-400">of</span>
                <span className="mt-2 font-[400] ml-1">object</span>
                <div className="mt-2 pb-2 px-2 border border-neutral-100 rounded-md">
                  <ObjectTypeFormatter typeinfo={typeinfo.properties} />
                </div>
              </>
            )}
            {typeinfo?.type === 'array' && <TypeFormatter type="array" typeinfo={typeinfo.items} />}
            {typeinfo?.type !== "object" && typeinfo?.type !== "array" && (
              <>
              <span className="text-xs text-neutral-400">of</span>
              <span className="ml-1">{typeinfo?.type}</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  } else if (type === 'object') {

    return (
      <div>
        <div className="w-min flex flex-row items-center cursor-pointer hover:opacity-80" onClick={() => setOpen(!isOpen)}>
          {/* <p className="mt-2 font-[400]">object</p> */}
          {typeinfo && (
            <div className="flex flex-row items-center whitespace-nowrap mt-0.5 text-xs border rounded-full px-2 bg-neutral-50 text-neutral-500 transition">
              {isOpen ? 'Hide child attributes' : 'Show child attributes'}
            </div>
          )}
        </div>
        {isOpen && <ObjectTypeFormatter typeinfo={typeinfo} />}
      </div>
    );
  }

  return <p className="">{type}</p>;
};

export const ParamsTable = ({ params }) => {

  const renderParams = (params) => {
    return Object.keys(params).map((key) => {
      const p = params[key];

      const typeinfo = p.type === "array" ? p.items : p.type === "object" ? p.properties : p.typeinfo;
      return (
        <tr className="" key={key}>
          <td className="w-32 py-2 align-top text-sm border-r border-neutral-50">
            {key}
            {p.required && <span className="text-rose-500 text-xs ml-0.5 transform -translate-y-1 inline-block select-none">*</span>}
          </td>
          {p.type && (
            <td className="pl-3 w-64 py-2 align-top max-w-[300px] overflow-x-auto">
              {p.type === "array" && (
                  <p className="font-[400]">array</p>
              )}
              {p.type === "object" && (
                  <p className="font-[400]">object</p>
              )}
              <TypeFormatter type={p.type} typeinfo={typeinfo} />
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div className="relative overflow-auto border rounded-md p-2">
      <div className="overflow-hidden my-2">
        <table className="border-collapse table-auto w-full text-sm">
          <thead className="text-bold">
            <tr>
              <th className="w-32 border-b border-slate-200 pl-0 p-4 pt-0 pb-3 text-slate-700 dark:text-slate-200 text-left py-2 align-top text-xs uppercase font-semibold">Property</th>
              <th className="w-64 py-2 align-top border-slate-200 text-xs uppercase border-b dark:border-slate-600 font-semibold p-4 pl-3 pt-0 pb-3 text-slate-700 dark:text-slate-200 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {isObject(params) ? (
              renderParams(params)
            ) : (
              Array.isArray(params) && params.map((param) => {
                if (param.type === 'object' && param.properties) {
                  return (
                    <tr className="" key={param.name}>
                      <td className="w-32 py-2 font-mono align-top text-sm">
                        {param.name}
                        {param.required && <span className="text-rose-500 text-xs ml-0.5 transform -translate-y-1 inline-block select-none">*</span>}
                      </td>
                      <td className="w-64 py-2 align-top max-w-[300px] overflow-x-auto">
                        <div className="pl-4">
                          <TypeFormatter type="object" typeinfo={param.properties} />
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return renderParams({ [param.name]: param });
                }
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getRequestBodyExample = (props) => {
  const example = Object.keys(props).reduce((acc, value) => {
    if (props[value]?.example !== undefined) {
      acc[value] = props[value].example;
    }
    return acc;
  }, {});
  return Object.keys(example).length ? example : null;
};


export const getRequestBodySchema = (props) => {
  const required = props.required || [];
  const properties = props.properties || {};
  return Object.keys(properties).reduce((acc, value) => {
    const type = properties[value].type;
    let typeinfo = undefined;
    if (type === 'array') {
      typeinfo = properties[value].items;
    } else if (type === 'object') {
      typeinfo = properties[value].properties;
    }
    acc[value] = {
      type,
      items: type === 'array' ? typeinfo : undefined,
      properties: type === 'object' ? typeinfo : undefined,
      example: properties[value].example,
      required: required.includes(value)
    };
    return acc;
  }, {});
};



export const RequestBody = ({ requestBody, schemas }) => {
  const schemaRef = requestBody?.content?.["application/json"]?.schema
  const examples = requestBody?.content?.["application/json"]?.examples

  let resolvedSchema = null;
  if (schemaRef && schemaRef.$ref) {
    resolvedSchema = resolveRef(schemaRef.$ref, schemas);
  } else {
    resolvedSchema = schemaRef;
  }
  if (!resolvedSchema) {
    return <p className="text-neutral-500">No request body.</p>;
  }

  const exampleRequest = getRequestBodyExample(resolvedSchema.properties);
  const exampleTabs = examples ? Object.entries(examples).map(([key, value], index) => (
    <Tab key={key} title={`Example${Object.keys(examples).length > 1 ? ` ${index + 1}` : ""}`}>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Tab>
  )) : null;

  return <Tabs>
      <Tab title="Schema" className="pt-4">
        <ParamsTable params={getRequestBodySchema(resolvedSchema)} />
      </Tab>
      {exampleTabs}
      {exampleRequest && (
        <Tab title="Example Values" className="pt-4">
          <pre>{JSON.stringify(exampleRequest, null, 2)}</pre>
        </Tab>
      )}
    </Tabs>
}

export const RevealButton = ({ open, className, onClick }) => {
  return <div onClick={onClick} className={`${className} p-1 rounded-md hover:bg-neutral-100 transition cursor-pointer`}><ChevronRight className={cn(
      "w-6 h-6 text-neutral-600 transform transition", {
        "rotate-0": !open,
        "rotate-90": open,
      }
    )} /></div>
}

export const getResponseBodyExample = (responseObj, code, schemas) => {
  if (!responseObj) return { schema: null, example: null };
  const successStatusCode = code.startsWith('2');
  if (!successStatusCode) return { schema: null, example: null };

  const contentObj = responseObj.content;
  if (!contentObj || Object.keys(contentObj).length === 0) return { schema: null, example: null };

  const contentType = Object.keys(contentObj)[0];
  const schemaObj = contentObj[contentType]?.schema || null;

  let example = null;
  if (contentObj[contentType]?.examples) {
      const exampleKey = Object.keys(contentObj[contentType].examples)[0];
      example = contentObj[contentType].examples[exampleKey]?.value || null;
  } else if (schemaObj && schemaObj.example) {
      example = schemaObj.example;
  }

  let resolvedSchema = resolveNestedRefs(schemaObj, schemas);

  if (!example && resolvedSchema) {
      example = generateExample(resolvedSchema, schemas); // Generate example from resolved schema
  }

  return { schema: resolvedSchema, example };
};

function generateExample(schema) {
  if (!schema) return null;

  if (schema.type === 'object') {
      let result = {};
      if (schema.properties) {
          for (const key in schema.properties) {
              result[key] = generateExample(schema.properties[key]);
          }
      }
      return result;
  }

  if (schema.type === 'array') {
      return [generateExample(schema.items)];
  }

  if (schema.hasOwnProperty('example')) {
      return schema.example;
  }

  switch (schema.type) {
      case 'string':
          return '';
      case 'number':
          return 0;
      case 'boolean':
          return false;
      case 'null':
          return null;
      default:
          return null;
  }
}

export const HTTPAPIDoc = ({ method, baseUrl, path, description, parameters, responses, requestBody, isOpen: _isOpen, schemas }) => {
  const [isOpen, setOpen] = useState(_isOpen)
  const queryParams = parameters?.filter(p => p.in === "query")
  const pathParams = parameters?.filter(p => p.in === "path")
  const formDataParams = parameters?.filter(p => p.in === "formData")
  const bodyParams = parameters?.filter(p => p.in === "body")


  return <div className="px-12 pt-4 pb-4 rounded-md bg-white border border-neutral-200 flex flex-col gap-2 overflow-hidden not-prose">
    <div className="relative flex flex-row gap-4 items-center m-0 not-prose">
      <RevealButton
        className="absolute left-[-38px]"
        open={isOpen}
        onClick={() => setOpen(o => !o)}
      />
      <Badge method={method} />
      <p className="text-sm"><span className="text-neutral-400">{baseUrl || ''}</span><span className="font-medium text-neutral-900">{path || ''}</span>
      </p>
    </div>
    <p className="m-0 p-0 mt-2">{description}</p>
    { isOpen && <>
      <div>
        <p className="font-semibold my-4">Parameters</p>
        {!(parameters?.length > 0) && <p className="p-4 text-slate-500 text-sm rounded-md bg-slate-50">No parameters</p>}
        {queryParams?.length > 0 && <>
            <p className="font-semibold text-sm my-4">Query</p>
            <ParamsTable params={queryParams} />
          </>
        }
        {pathParams?.length > 0 && <>
            <p className="font-semibold my-4 text-sm">Path</p>
            <ParamsTable params={pathParams} />
          </>
        }
        {bodyParams?.length > 0 && <>
            <p className="font-semibold mt-12 text-sm">Body</p>
            <ParamsTable params={bodyParams} />
          </>
        }
        {formDataParams?.length > 0 && <>
            <p className="font-semibold mt-10 text-sm">Form data</p>
            <ParamsTable params={formDataParams} />
          </>
        }
      </div>
      {requestBody && Object.keys(requestBody)?.length > 0 &&
        <>
          <p className="font-semibold mt-4 m-0 p-0">Body</p>
          <RequestBody requestBody={requestBody} schemas={schemas} />
        </>
      }
      {responses && Object.keys(responses)?.length > 0 && (
        <>
          <p className="font-semibold mt-4 m-0 p-0">Responses</p>
          {Object.keys(responses).map((code) => {
            const responseBody = responses[code];

            const { schema, example } = getResponseBodyExample(responseBody, code, schemas);
            const examples = generateExample(schema, schemas);

            const exampleTabs = example && Object.keys(example).length > 0
            ? (
                <Tab title="Example" className="pt-4">
                  <pre>{JSON.stringify(example, null, 2)}</pre>
                </Tab>
              )
              : examples && Object.keys(examples).length > 0
              ? 
                  <Tab title="Example" className="pt-4">
                    <pre>{JSON.stringify(examples, null, 2)}</pre>
                  </Tab>
              : null;

              return (
                <div className="border-b border-neutral-100 pb-4 mb-4" key={code}>
                  <ResponseTag code={code} />
                  <p
                    className="text-slate-500 my-2 ml-6 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: responseBody.description?.replace(/\n/gi, ''),
                    }}
                  />
                  {schema && schema?.properties?.data?.properties && (
                    <Tabs>
                      <Tab title="Schema" className="pt-4">
                        <ParamsTable params={schema.properties.data.properties} />
                      </Tab>
                      {exampleTabs}
                    </Tabs>
                  )}
                  {schema && !schema?.properties?.data?.properties && exampleTabs && (
                    <Tabs>
                      {exampleTabs}
                    </Tabs>
                  )}
                </div>
              );
            })}
          </>
        )}


      </>
    }
  </div>
}