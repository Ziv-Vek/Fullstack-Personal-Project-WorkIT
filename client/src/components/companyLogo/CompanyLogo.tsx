import logo from "../../assets/logo.png";
import logoNegative from "../../assets/logo-negative.png";

type LogoProps = {
  logoWidth?: number;
  logoHeight?: number;
  useNegative?: boolean;
};

function CompanyLogo({ logoWidth, logoHeight, useNegative }: LogoProps) {
  return (
    <div>
      <img
        src={useNegative == true ? logoNegative : logo}
        alt={"company-logo"}
        height={(logoHeight ??= 78)}
        // width={(logoWidth ??= 78)}
      />
    </div>
  );
}

export default CompanyLogo;
