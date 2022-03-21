/**
 * This interface tells us that classes which are implemented by Logger are able to log to somewhere.
 */
export interface Logger {
    log(message:string):void
}
