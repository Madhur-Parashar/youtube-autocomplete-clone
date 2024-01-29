import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "../utils/debounce";

export default function useFetch(urlData) {
  const url = urlData && urlData.toLowerCase().trimEnd();
  const [fetchedData, setFetchedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const cachedData = useRef(null);
  const currentURL = useRef("");
  currentURL.current = url;
  console.log("current url in useFetch", url, currentURL.current);
  const fetchData = async (currentUrl) => {
    console.log("url received", currentUrl, currentURL.current);
    if (currentURL.current !== currentUrl) return;
    setLoading(true);
    try {
      let response = await fetch(currentUrl);
      let res = await response.json();
      console.log("in fetchData", currentUrl, currentURL.current);
      if (res.Response === "True") {
        setFetchedData(res.Search);
        setError(null);
        cachedData.current = {
          ...cachedData.current,
          [currentUrl]: res.Search,
        };
      } else {
        setError(res.Error);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const debouncedFn = useMemo(() => {
    return debounce(fetchData, 1000);
  }, []);

  useEffect(() => {
    console.log("fetched for url:", url);
    if (url) {
      console.log(
        "cachedData.current",
        cachedData.current,
        url,
        cachedData.current && url in cachedData.current
      );
      if (cachedData.current && url in cachedData.current) {
        setFetchedData(cachedData.current[url]);
        setError(null);
      } else {
        console.log("fetch");
        debouncedFn(url);
      }
    }
  }, [url, debouncedFn]);

  return [fetchedData, error, loading];
}
