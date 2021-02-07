export const useFetch = async (url, options) => {

    let response = null;
    let error = null;
    let status = null;



    try {
        const res = await fetch(url, options);
        status = res.status
        const json = await res.json();

        response = json

    } catch (err) {
        error = err
    }


    return { response, error, status };
};
