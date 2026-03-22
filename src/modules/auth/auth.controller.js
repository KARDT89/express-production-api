import ApiResponse from "../../common/utils/api-response";
import * as authService from "./auth.service";


const register = async (req, res) => {
    //something
    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration succhess", user)
};



export { register };
