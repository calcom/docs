import { useEffect, useState } from "react"
import { HTTPAPIDoc } from "@components/uicomp/httpapidoc"
import { openApiSpec } from "@components/components/lib/apiSpec"

export const OpenAPIDoc = ({ version = "v1", url, path, method, isOpen }) => {

  const [spec, setSpec] = useState(undefined)


  const fetchMock = (url, version) => {
    return new Promise((resolve, reject) => {
      if (version === "v1") {
        // Mimicking a successful response for version "v1"
        const response = {
          ok: true,
          status: 200,
          json: () => Promise.resolve(openApiSpec),
        };
        resolve(response);
      } else {
        // Fetching from the actual URL for version "v2"
        fetch(url)
          .then(response => {
            if (!response.ok) {
              reject(`HTTP error! Status: ${response.status}`);
            }
            return response.json().then(data => {
              // console.log({data})
              resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve(data),
              });
            });
          })
          .catch(error => reject(error));
      }
    });
  };
  

  useEffect(() => {
    if (!url || !path) {
      return
    }
    const run = async () => {
      const response = await fetchMock(url, version)
      const result = await response.json()
      if (!result) {
        return
      }

      let origin = "https://api.cal.com"
      if (result.schemes?.[0] && result.host) {
        origin = `${result.schemes?.[0]}://${result.host}`
      } else if (result.servers?.[0]) {
        origin = result.servers?.[0]?.url
      }

      let basePath = ""
      if (result?.basePath) {
        basePath = result.basePath
      }

      const baseUrl = `${origin.replace(/\/+$/gi, '')}${basePath}`

      const spec = result.paths?.[path]?.[method.toLowerCase()]

      if (!spec) {
        return
      }

      const schemas = result.components?.schemas || {};

      setSpec({
        baseUrl,
        description: spec?.summary || spec?.description,
        parameters: spec?.parameters,
        responses: spec?.responses || {},
        requestBody: spec?.requestBody || {},
        schemas,
      })
    }
    run()
  }, [url, path])

  return <HTTPAPIDoc
    method={method}
    baseUrl={spec?.baseUrl}
    path={path}
    description={spec?.description}
    parameters={spec?.parameters}
    responses={spec?.responses}
    requestBody={spec?.requestBody}
    schemas={spec?.schemas}
    isOpen={isOpen} />
}

<OpenAPIDoc
  url="https://api.cal.com/docs"
  method="POST"
  path="/webhooks"
  isOpen
/>
