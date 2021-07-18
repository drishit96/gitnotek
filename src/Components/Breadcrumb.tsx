import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Path = {
  name: string;
  location: string;
};

const Breadcrumb = ({ path }: { path: string }) => {
  const [pathLinks, setPathLinks] = useState<Path[]>([]);

  useEffect(() => {
    let pathTillNow = "/workspace/";
    const paths: Path[] = [{ name: "Home", location: pathTillNow }];
    if (path !== "") {
      path.split("/").forEach((name: string) => {
        paths.push({ name: name, location: pathTillNow + name });
        pathTillNow += `${name}/`;
      });
    }
    setPathLinks(paths);
  }, [path]);

  return (
    <>
      <div className="w-full p-2">
        {pathLinks.map((link) => {
          return (
            <>
              <span className="text-textColorPrimary">
                <Link
                  data-id={`brc-lnk-${encodeURI(link.location)}`}
                  className="underline"
                  to={link.location}
                >
                  {" " + link.name}
                </Link>{" "}
                /
              </span>
            </>
          );
        })}
      </div>
    </>
  );
};
export default Breadcrumb;
