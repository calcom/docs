import { useState } from "react"
import { HTTPResponseCodes } from "@utils/http"
import { Tabs, Tab } from "@components/uicomp/tabbar"
import { ChevronRight } from "@components/icons-alt/chevron-right"
import cn from "classnames"

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
    console.log({schemas}, {ref});
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
  return <span className="font-mono text-xs">{example}</span>;
};


const ObjectTypeFormatter = ({ typeinfo }) => {

  return (
    <div className="mt-4 overflow-x-auto flex flex-col gap-2 divide-y divide-neutral-100">
      {typeinfo && Object.keys(typeinfo).map(k => (
        <div key={k} className="py-2">
          <div>
            <span className="text-xs">{k}</span>
            <span className="ml-4 font-semibold">{typeinfo[k].type}</span>
          </div>
          {typeinfo[k].example && (
            <div>
              <p className="mb-2 text-neutral-400">Example:</p>
              <div className="bg-slate-50 text-slate-500 p-2 rounded-md font-mono text-xs whitespace-pre-wrap">
                {renderExample(typeinfo[k].example)}
              </div>
            </div>
          )}
          {typeinfo[k].properties && (
            <ObjectTypeFormatter typeinfo={typeinfo[k].properties} />
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
              {isOpen ? 'Hide items' : 'Show items'}
            </div>
          )}
        </div>
        {isOpen && (
          <div className="mt-2 pb-2 px-2 border border-neutral-100 rounded-md">
            {typeinfo?.type === 'object' && (
              <>
                <p className="font-semibold">object</p>
                <div className="mt-2 pb-2 px-2 border border-neutral-100 rounded-md">
                  <ObjectTypeFormatter typeinfo={typeinfo.properties} />
                </div>
              </>
            )}
            {typeinfo?.type === 'array' && <TypeFormatter type="array" typeinfo={typeinfo.items} />}
          </div>
        )}
      </div>
    );
  } else if (type === 'object') {
    return (
      <div>
        <div className="w-min flex flex-row items-center cursor-pointer hover:opacity-80" onClick={() => setOpen(!isOpen)}>
          <p className="font-semibold">object</p>
          {typeinfo && (
            <div className="flex flex-row items-center whitespace-nowrap mt-0.5 ml-2 text-xs border rounded-full px-2 bg-neutral-50 text-neutral-500 transition">
              {isOpen ? 'Hide fields' : 'Show fields'}
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

      const typeinfo = p.type === "array" ? p.items : p.typeinfo;
      return (
        <tr className="" key={key}>
          <td className="w-48 py-2 align-top text-sm">
            {key}
            {p.required && <span className="text-rose-500 text-xs ml-0.5 transform -translate-y-1 inline-block select-none">*</span>}
          </td>
          {p.type && (
            <td className="w-48 py-2 align-top max-w-[200px] overflow-x-auto">
              {p.type === "array" && (
                  <p className="font-semibold">array</p>
              )}
              <TypeFormatter type={p.type} typeinfo={typeinfo} />
            </td>
          )}
          <td className="py-2 align-top">
            {p.example || ""}
          </td>
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
              <th className="w-48 border-b border-slate-200 pl-0 p-4 pt-0 pb-3 text-slate-700 dark:text-slate-200 text-left py-2 align-top text-xs uppercase font-semibold">Property</th>
              <th className="w-48 py-2 align-top border-slate-200 text-xs uppercase border-b dark:border-slate-600 font-semibold p-4 pl-0 pt-0 pb-3 text-slate-700 dark:text-slate-200 text-left">Type</th>
              <th className="w-48 py-2 align-top border-slate-200 text-xs uppercase border-b dark:border-slate-600 font-semibold p-4 pl-0 pt-0 pb-3 text-slate-700 dark:text-slate-200 text-left">Example</th>
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
                      <td className="w-48 py-2 font-mono align-top text-sm">
                        {param.name}
                        {param.required && <span className="text-rose-500 text-xs ml-0.5 transform -translate-y-1 inline-block select-none">*</span>}
                      </td>
                      <td className="w-48 py-2 align-top max-w-[200px] overflow-x-auto">
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
      description: properties[value].description?.replace("\n", "<br />"),
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

  const exampleTabs = examples ? Object.entries(examples).map(([key, value], index) => (
    <Tab key={key} title={`Example${Object.keys(examples).length > 1 ? ` ${index + 1}` : ""}`}>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Tab>
  )) : null;
  console.log("--->", getRequestBodySchema(resolvedSchema))
  return <Tabs>
      <Tab title="Schema" className="pt-4">
        <ParamsTable params={getRequestBodySchema(resolvedSchema)} />
      </Tab>
      {exampleTabs}
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

  let resolvedSchema = null;
  if (schemaObj && schemaObj.$ref) {
    resolvedSchema = resolveRef(schemaObj.$ref, schemas);
  } else {
    resolvedSchema = schemaObj;
  }

  return { schema: resolvedSchema, example };
};



export const HTTPAPIDoc = ({ method, baseUrl, path, description, parameters, responses, requestBody, isOpen: _isOpen, schemas }) => {
  const [isOpen, setOpen] = useState(_isOpen)
  const queryParams = parameters?.filter(p => p.in === "query")
  const pathParams = parameters?.filter(p => p.in === "path")
  const formDataParams = parameters?.filter(p => p.in === "formData")
  const bodyParams = parameters?.filter(p => p.in === "body")


  return <div className="pl-12 pr-6 pt-4 pb-4 rounded-md bg-white border border-neutral-200 flex flex-col gap-2 overflow-hidden not-prose">
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
        {!(parameters?.length > 0) && <p className="text-neutral-500">No parameters</p>}
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
            <table className="w-full text-sm prose border-collapse min-w-full m-0 table-fixed">
              <tbody>
                {Object.keys(responses).map((code) => {
                  const responseBody = responses[code];
                  const { schema, example } = getResponseBodyExample(responseBody, code, schemas);
                  return (
                    <tr className="" key={code}>
                      <td className="w-48 py-2 align-top pr-2">
                        <ResponseTag code={code} />
                        <p
                          className="text-slate-500 mt-2 ml-6"
                          dangerouslySetInnerHTML={{
                            __html: responseBody.description?.replace(/\n/gi, ''),
                          }}
                        />
                        {schema && schema?.properties?.data?.properties && (
                          <div className="mt-4 overflow-x-auto">
                            <h4 className="mb-4">Schema</h4>
                            <>
                            {console.log("===>", schema.properties.data.properties)}
                              <ParamsTable params={schema.properties.data.properties} />
                            </>
                          </div>
                        )}
                        {example && (
                          <div className="mt-4 overflow-x-auto">
                            <h4>Example</h4>
                            <pre className="w-full overflow-x-auto">
                              {JSON.stringify(example, null, 2)}
                            </pre>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

      </>
    }
  </div>
}

<div className="prose p-8 max-w-full">
<HTTPAPIDoc
  isOpen
  method="POST"
  baseUrl="http://api.example.com"
  path="/greet"
  description="Greet the user."
  responses={{
    "200":{
      "description":"Booking(s) created successfully.",
      "content":{
         "application/json":{
            "examples":{
               "bookings":{
                  "value":{
                     "id":11223344,
                     "uid":"5yUjmAYTDF6MXo98re8SkX",
                     "userId":123,
                     "eventTypeId":2323232,
                     "title":"Debugging between Syed Ali Shahbaz and Hello Hello",
                     "description":null,
                     "customInputs":{

                     },
                     "responses":null,
                     "startTime":"2023-05-24T13:00:00.000Z",
                     "endTime":"2023-05-24T13:30:00.000Z",
                     "location":"Calcom HQ",
                     "createdAt":"2023-04-19T10:17:58.580Z",
                     "updatedAt":null,
                     "status":"PENDING",
                     "paid":false,
                     "destinationCalendarId":2180,
                     "cancellationReason":null,
                     "rejectionReason":null,
                     "dynamicEventSlugRef":null,
                     "dynamicGroupSlugRef":null,
                     "rescheduled":null,
                     "fromReschedule":null,
                     "recurringEventId":null,
                     "smsReminderNumber":null,
                     "scheduledJobs":[

                     ],
                     "metadata":{

                     },
                     "isRecorded":false,
                     "user":{
                        "email":"test@cal.com",
                        "name":"Syed Ali Shahbaz",
                        "timeZone":"Asia/Calcutta"
                     },
                     "attendees":[
                        {
                           "id":12345,
                           "email":"hello@gmail.com",
                           "name":"Hello Hello",
                           "timeZone":"Europe/London",
                           "locale":"en",
                           "bookingId":11223344
                        }
                     ],
                     "payment":[

                     ],
                     "references":[

                     ]
                  }
               }
            }
         }
      }
   },
    "404": { "description": "Pet not found" },
    "405": { "description": "Bad request\n<table>\n  <tr>\n    <td>Message</td>\n    <td>Cause</td>\n  </tr>\n  <tr>\n    <td>Booking body is invalid</td>\n    <td>Missing property on booking entity.</td>\n  </tr>\n  <tr>\n    <td>Invalid eventTypeId</td>\n    <td>The provided eventTypeId does not exist.</td>\n  </tr>\n  <tr>\n    <td>Missing recurringCount</td>\n    <td>The eventType is recurring, and no recurringCount was passed.</td>\n  </tr>\n  <tr>\n    <td>Invalid recurringCount</td>\n    <td>The provided recurringCount is greater than the eventType recurring config</td>\n  </tr>\n</table>\n" }
  }}
  requestBody={{
    "description": "Create a new attendee related to one of your bookings",
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": ["bookingId", "name", "email"],
          "properties": {
            "bookingId": { "type": "number", "example": 1, "description": "The booking id" },
            "email": { "type": "string", "example": "email@example.com" },
            "name": { "type": "string", "example": "John Doe" },
            "timeZone": { "type": "string", "example": "Europe/London" },
            "attendees": {
              "type": "array",
              "description": "List of attendees of the booking",
              "items": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "email": { "type": "string", "format": "email" },
                  "timeZone": { "type": "string" },
                  "locale": { "type": "string" }
                }
              }
            },
            "days": {
              "type": "array",
              "description": "Array of integers depicting weekdays",
              "items": { "type": "integer", "enum": [0, 1, 2, 3, 4, 5] }
            },
            "schema": {
              "type": "object",
              "required": ["title", "slug", "length", "metadata"],
              "properties": {
                "length": { "type": "number", "example": 30 },
                "metadata": {
                  "type": "object",
                  "example": {
                    "smartContractAddress": "0x1234567890123456789012345678901234567890"
                  }
                },
                "title": { "type": "string", "example": "My Event" },
                "slug": { "type": "string", "example": "my-event" }
              }
            }
          }
        },
        "examples":{
          "team-event-type":{"summary":"An example of a team event type POST request","value":{"title":"Tennis class","slug":"tennis-class-{{$guid}}","length":60,"hidden":false,"position":0,"teamId":3,"eventName":null,"timeZone":null,"periodType":"UNLIMITED","periodStartDate":null,"periodEndDate":null,"periodDays":null,"periodCountCalendarDays":null,"requiresConfirmation":true,"recurringEvent":{"interval":2,"count":10,"freq":2},"disableGuests":false,"hideCalendarNotes":false,"minimumBookingNotice":120,"beforeEventBuffer":0,"afterEventBuffer":0,"schedulingType":null,"price":0,"currency":"usd","slotInterval":null,"successRedirectUrl":null,"description":null,"locations":[{"address":"London","type":"inPerson"}],"metadata":{}}},
          "event-type":{"summary":"An example of a team event type POST request","value":{"title":"Tennis class","slug":"tennis-class-{{$guid}}","length":60,"hidden":false,"position":0,"teamId":3,"eventName":null,"timeZone":null,"periodType":"UNLIMITED","periodStartDate":null,"periodEndDate":null,"periodDays":null,"periodCountCalendarDays":null,"requiresConfirmation":true,"recurringEvent":{"interval":2,"count":10,"freq":2},"disableGuests":false,"hideCalendarNotes":false,"minimumBookingNotice":120,"beforeEventBuffer":0,"afterEventBuffer":0,"schedulingType":null,"price":0,"currency":"usd","slotInterval":null,"successRedirectUrl":null,"description":null,"locations":[{"address":"London","type":"inPerson"}],"metadata":{}}}
        }
      }
    }
  }}
/>
</div>
