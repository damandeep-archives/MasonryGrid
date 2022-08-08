import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MasonaryLayout from "./MasonryLayout";
function Home() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const [search, setSearch] = useState("");
  const pageSize = 30;
  const [col, setCols] = useState(3);

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) setCols(1);
    else setCols(3);
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [obs, setObs] = useState(false);
  const callbackfn = (entries) => {
    if (entries[0].isIntersecting) {
      console.log("interseci");
      if (loading) return;
      console.log("I am intersecting");
      setLoading(true);
      // Just to show the loader
      setTimeout(() => {
        apiCall();
      }, 1000);
    }
  };

  const apiCall = async () => {
    setObs(false);
    const res = await axios.get("https://api.unsplash.com/search/photos", {
      headers: {
        Authorization: `${process.env.REACT_APP_KEY}`,
      },
      params: { query: search, per_page: pageSize, page: page },
    });

    let data = res["data"]["results"];
    setPage((p) => p + 1);
    let newList = [...list, ...data];
    setList([...newList]);
    setLoading(false);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };
  useEffect(() => {
    let observer = new IntersectionObserver(callbackfn, options);
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [bottomRef, options, obs]);

  const onComplete = () => {
    setObs(true);
  };

  const [downloadShow, setDownloadShow] = useState({ show: false, idx: 0 });
  const handleMouseEnter = (index) => {
    setDownloadShow({ show: true, idx: index });
  };

  const handleMouseLeave = (index) => {
    setDownloadShow({ show: false, idx: index });
  };

  const clearResults = (e) => {
    setObs(false);
    setList([]);
    setLoading(false);
    setPage(1);
  };

  return (
    <>
      <div className="h-10 flex jc-c ai-c c-light">
        <div className="flex ai-c">
          <input
            className="inputValue"
            onKeyUp={(e) => {
              clearResults(e);
              setSearch(e.target.value);
            }}
            type="text"
          />
          &nbsp;
          <button className="btn" onClick={apiCall}>
            Search
          </button>
        </div>
      </div>
      <div className="container ">
        <MasonaryLayout columns={col}>
          {list.map((ele, i) => {
            return (
              <div
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleMouseLeave(i)}
                key={i}
                className="box grid-item"
              >
                <img
                  width="640"
                  height="360"
                  style={{ aspectRatio: ele.width / ele.height }}
                  className="img item"
                  onLoad={onComplete}
                  onError={onComplete}
                  src={ele?.urls?.full || ele?.urls?.small}
                />

                {downloadShow.show && downloadShow.idx == i && (
                  <div className="downloadIcon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-file-arrow-down-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM8 5a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5A.5.5 0 0 1 8 5z" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </MasonaryLayout>

        {loading && (
          <div className="text-center w-100">
            <h1>Loading...</h1>
          </div>
        )}
      </div>

      {obs && <div className="h-2 text-center" ref={bottomRef}></div>}
    </>
  );
}

export default Home;
