export class Settings {
    public static ApiUrl: string = process.env.VUE_APP_APIBASEURL;
    public static ApiPath: string = process.env.VUE_APP_APIPATH;
    
    public static AuthUserName: string = process.env.VUE_APP_AUTHUSERNAME;
    public static AuthPassword: string = process.env.VUE_APP_AUTHPASSWORD;

    public static PublicKey: string = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;
}