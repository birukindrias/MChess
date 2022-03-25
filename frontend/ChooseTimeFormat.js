import React from "react";
import { getOrgBoardProps } from "./Game";

export default function ChooseTimeFormat() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 995);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 995)
    );
  });

  return (
    <div className="container">
      {isMobile ? null : <Board boardProps={getOrgBoardProps(false)} />}
    </div>
  );
}
