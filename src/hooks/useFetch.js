import { useState, useEffect } from "react";
import api from "../api/axios";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async (retries = 1) => {
            try {
                const res = await api.get(url);
                setData(res.data.data);
                setLoading(false);
            } catch (error) {

                if (!error.response && retries > 0) {
                    setTimeout(() => fetch(retries - 1), 2000);
                    return;
                }


                if (!err.response) {
                    setError('Unable to connect. Please check your connection.');
                } else if (err.response.status === 404) {
                    setError('Resource not found.');
                } else if (err.response.status >= 500) {
                    setError('Something went wrong on our end. Try again shortly.');
                } else {
                    setError('Something went wrong.');
                }

                setLoading(false);


            }
        };
        fetch();
    }, [url]);

    return { data, loading, error };

}

export default useFetch;


