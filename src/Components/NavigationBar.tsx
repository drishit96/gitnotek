import { commonService } from "src/services/common.service";
import SecondaryIconButton from "./SecondaryIconButton";

const NavigationBar = ({ showBackButton }: { showBackButton: boolean }) => {
  return (
    <>
      <nav className="flex p-2 w-full shadow-md sticky top-0 bg-primaryColor z-20">
        {showBackButton ? (
          <SecondaryIconButton
            id="btn-back"
            text="Back"
            hideText={true}
            isDarkBackground={true}
            onClickFn={() => {
              window.history.go(-1);
            }}
          >
            <>
              <svg
                className="text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H6M12 5l-7 7 7 7" />
              </svg>
            </>
          </SecondaryIconButton>
        ) : null}
        <p className="text-white ml-5 mt-auto mb-auto">Gitnotek</p>
        <div className="flex ml-auto mt-auto mb-auto">
          <SecondaryIconButton
            id="btn-toggleTheme"
            text="Toggle theme"
            hideText={true}
            isDarkBackground={true}
            onClickFn={() => commonService.toggleTheme()}
          >
            <>
              <svg
                className="text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </>
          </SecondaryIconButton>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;
