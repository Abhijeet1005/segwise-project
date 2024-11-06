import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [category, setcategory] = useState("");
  const [date, setdate] = useState("");
  const [data, setdata] = useState({});

  const handlerSubmit = async (e: any) => {
    e.preventDefault();
    axios
      .get(
        `http://localhost:7001/api/v1/review/countAndTrends?category=${category}&date=${date}`,
        {
          headers: {
            "Content-Type": "application/json", // Specify the content type if needed
          },
          withCredentials: true, // Include cookies in the request
        }
      )
      .then((response) => {
        console.log("Response data:", response.data);
        setdata(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const navigate = useNavigate();
  const dates = [];
  for (let i = 7; i >= 1; i--) {
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - i);
    const year = oneWeekAgo.getFullYear();
    const month = String(oneWeekAgo.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(oneWeekAgo.getDate()).padStart(2, "0");

    // Format the date as 'YYYY-MM-DD'
    const formattedDate = `${year}-${month}-${day}`;
    dates.push(formattedDate);
  }

  return (
    <div className="w-full flex mt-24 flex-col gap-20">
      <div className="mx-auto">
        <button
          onClick={() => {
            navigate("/register");
          }}
          type="button"
          className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Register
        </button>
        <button
          onClick={() => {
            navigate("/login");
          }}
          type="button"
          className="text-black bg-gray-200 focus:ring-4 focus:ring-black-300 font-medium rounded-lg text-lg px-5 py-2.5 me-2 mb-2 focus:outline-none"
        >
          Login
        </button>
      </div>

      <div className="mx-auto">
        {/* dropdown  */}
        <div>
          <form className="max-w-sm mx-auto flex-col gap-5 flex">
            <div>
              <label
                htmlFor="categories"
                className="block mb-2 text-sm font-medium text-white"
              >
                Select your category
              </label>
              <select
                onChange={(e) => setcategory(e.target.value)}
                id="categories"
                className="border   text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Bugs">Bugs</option>
                <option value="Complaints">Complaints</option>
                <option value="Crashes">Crashes</option>
                <option value="Praises">Praises</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-60">
              <label
                htmlFor="dates"
                className="block mb-2 text-sm font-medium text-white "
              >
                Pick a date
              </label>
              <select
                onChange={(e) => setdate(e.target.value)}
                id="dates"
                className="border   text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              >
                {dates.map((date) => {
                  return <option value={date}>{date}</option>;
                })}
              </select>
            </div>
            <button
              onClick={handlerSubmit}
              type="button"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div>
        <pre className="text-white text-left border border-white border-1 w-fit p-5 mx-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Home;
