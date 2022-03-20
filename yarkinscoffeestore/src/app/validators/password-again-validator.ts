import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordAgainValidator:ValidatorFn = (formReference:AbstractControl): ValidationErrors | null =>{

    if( formReference.get('password') == null || formReference.get('password') == null)
        return null;

    const password = formReference.get('password');
    const passwordAgain = formReference.get('passwordAgain');

    return (password?.value != passwordAgain?.value)? {samePassword:true} : null;
};