import express from "express";
import { apiAuth } from "./authentication";

export const apiRoot = express.Router();
apiRoot.use("/authentication", apiAuth);
