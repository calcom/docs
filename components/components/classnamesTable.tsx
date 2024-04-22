import { googleCalendarAtomClassnamesPropData, availabilitySettingsAtomClassnamesPropData, bookerAtomPropsClassnamesPropData } from "@utils/atomsClassnameTableData";

export default ({
    atom
  }: {
    atom: string;
  }) => {
  let tableData = [{name: '', description: ''}];

  console.log(atom, 'classnames table test');
  

  if (atom === "google calendar") { 
    tableData = googleCalendarAtomClassnamesPropData
  }

  if (atom === "availability settings") {
    tableData = availabilitySettingsAtomClassnamesPropData
  }

  if (atom === 'booker') {
    tableData = bookerAtomPropsClassnamesPropData
  }

  if(atom === "") {
    return <></>
  }

    return (
      <
      >
        <table className="mt-8">
          <tbody>
            <tr className="border-[0.5px] border-black font-semibold">
                <td className="border-[0.5px] py-1 px-2 border-black">Classname</td>
                <td className="border-[0.5px] py-1 px-2 border-black">Description</td>
            </tr>
            {
              tableData.map((prop) => {
                return (
                  <tr key={prop.name} className="border-[0.5px] border-black">
                    <td className="border-[0.5px] py-1 px-2 border-black font-semibold">{prop.name}</td>
                    <td className="border-[0.5px] py-1 px-2 border-black">{prop.description}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </>
    );
  };
  