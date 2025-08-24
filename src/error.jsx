import { useRouteError } from "react-router-dom";
// import { FaCircleExclamation } from "react-icons/fa6";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="flex flex-col self-center">
        {/* <FaCircleExclamation /> */}
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
            <i>{error?.statusText || error?.message || 'Please try again'}</i>
        </p>
    </div>
  );
}
