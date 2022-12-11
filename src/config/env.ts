const env = {
    PG_HOST: process.env.PG_HOST!,
    PG_PORT: +process.env.PG_PORT!,
    PG_USER: process.env.PG_USER!,
    PG_PASSWORD: process.env.PG_PASSWORD!,
    PG_DATABASE: process.env.PG_DATABASE!,
    API_PORT: process.env.API_PORT!,
    SECRET_KEY: process.env.SECRET_KEY!,
    REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY!,
};

export default env;
