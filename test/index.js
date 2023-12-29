
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const Fetchuruza = require('../index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const apiKeyTMD = "173d57fbdc747b64167ef9afd3ec3a1a";
const urlFamoso = (actorName) => `https://api.themoviedb.org/3/search/person?api_key=${apiKeyTMD}&language=es-MX&query=${actorName}&page=1&include_adult=false`;

(async () => {

    try {

        const fetchu = new Fetchuruza();

        let res = await fetchu.getJson({
            url: "https://api.themoviedb.org/3/search/person",
            params: {
                "api_key": apiKeyTMD,
                "include_adult": false,
                language: "es-MX",
                query: "Jennifer Aniston",
                page: 1,
            }
        });

        console.log("res", res);

        setTimeout(async () => {
            fetchu.cancel();
        }, 3000)

        const Authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1MjQ2NTEyMDAsIl9pZCI6IjVlNzUxZDFhNGY0MDBkYzBlZDBhMjAxZCIsImNvbXBhbnkiOiI1ZTc1MWI3MjRmNDAwZGMwZWQwYTIwMWMiLCJFbXBsb3llZSI6IjVlNzUxZDFhNGY0MDBkYzBlZDBhMjAxZCIsInVzZXJJRCI6IjVlNzUxZDFhNGY0MDBkYzBlZDBhMjAxZCIsImNvbXBhbnlJRCI6IjVlNzUxYjcyNGY0MDBkYzBlZDBhMjAxYyIsIkVtcGxveWVlSUQiOiI1ZTc1MWQxYTRmNDAwZGMwZWQwYTIwMWQifQ.5R7Zy1O2CJjTkTZ-9h9CESepSbpFANq87iWrYI5H2Ho";

        fetchu.setCancelToken();

        let gpql2 = await fetchu.graphql({
            url: "https://graphql.levita.dev",
            query: `
                  query Employees(
                        $pagination: Pagination,
                        $search: EmployeeSearch,
                        $statusIMSS: StatusIMSS,
                        $or: EmployeeSearch,
                        $id: WhereClauseID
                  ) {
                        employees(
                              pagination: $pagination,
                              search: $search,
                              statusIMSS: $statusIMSS,
                              or: $or, id: $id
                        ) {
                              entities {
                                    id
                              }
                        }
                  }
            `,
            // variables: { username: "administrador" },
            headers: { Authorization, }
        }, (error) => {
            console.log("error callback", error);
        });

        console.log("gpql2", gpql2);
        
        fetchu.activeDebug();
        
        res = await fetchu.getJson({
            url: "https://api.themoviedb.org/3/search/person",
            params: {
                "api_key": apiKeyTMD,
                "include_adult": false,
                language: "es-MX",
                query: "Jennifer Aniston",
                page: 1,
            }
        });

        console.log("res", res);

        fetchu.cancelDebug();

        // await fetchu.graphql({});

        // let gpql = await fetchu.graphql({
        //     url: "https://35.225.97.245:4000/graphql",
        //     query: `
        //         query getBusquedaClaveProdServ($palabra: String!) {
        //             getBusquedaClaveProdServ(palabra: $palabra) {
        //                 claveCompleta
        //                 descripcion
        //             }
        //         }
        //     `,
        //     variables: { pal: 2 }
        // });

        // console.log("gpql", gpql);

    } catch({message}) { console.error("error", message); }

})();