
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const Caperuza = require('../index');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const apiKeyTMD = "173d57fbdc747b64167ef9afd3ec3a1a";
const urlFamoso = (actorName) => `https://api.themoviedb.org/3/search/person?api_key=${apiKeyTMD}&language=es-MX&query=${actorName}&page=1&include_adult=false`;

(async () => {

    try {

        const obtener = new Caperuza();

        let res = await obtener.getJson({
            url: "https://api.themoviedb.org/3/search/person",
            data: {
                "api_key": apiKeyTMD,
                "include_adult": false,
                language: "es-MX",
                query: "Jennifer Aniston",
                page: 1,
            }
        });

        console.log("res", res);

        let gpql2 = await obtener.graphql({
            url: "http://35.225.97.245:4900/graphql",
            query: `
                query isUsername($username: String!) {
                    isUsername(username: $username)
                }
            `,
            variables: { username: "administrador" }
        });

        console.log("gpql2", gpql2);

        await obtener.graphql({});

        let gpql = await obtener.graphql({
            url: "https://35.225.97.245:4000/graphql",
            query: `
                query getBusquedaClaveProdServ($palabra: String!) {
                    getBusquedaClaveProdServ(palabra: $palabra) {
                        claveCompleta
                        descripcion
                    }
                }
            `,
            variables: { pal: 2 }
        });

        console.log("gpql", gpql);

    } catch({message}) { console.error("error", message); }

})();