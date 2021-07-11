import cors from "cors";
import express from "express";
import { apiAuth } from "./authentication";

const corsOptions: cors.CorsOptions = {
  //for testing'
  origin: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  maxAge: 500,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

export const apiRoot = express.Router();
apiRoot.use("/authentication", cors(corsOptions), apiAuth);
