import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <main className="p-10 flex justify-center">
        <section className="flex flex-col items-center">
          <h3 className="text-4xl font-bold mt-5 ml-5 mr-5 mb-8 md:text-center">
            <span data-id="txt-tagLine-1-1" className="text-textColorPrimary">Save your notes in </span>
            <span data-id="txt-tagLine-1-2" className="text-4xl font-bold text-primaryColor">
              any git hosting service
            </span>
          </h3>
          <Link
            className="p-3 min-w-full md:min-w-max md:pl-10 md:pr-10 hover:shadow-xl text-white bg-primaryColor rounded-3xl shadow-md"
            to={`/workspace/`}
          >
            <p className="ml-1 mr-1 text-base text-center">Try now!</p>
          </Link>
        </section>
      </main>
    </>
  );
};

export default Home;
