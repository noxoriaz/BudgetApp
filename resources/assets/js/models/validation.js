
import { 
    required, 
    minLength, 
    maxLength,
    between, 
    numeric,
} from 'vuelidate/lib/validators'

export const entryValidations = {
    name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
    },
    description: {
        required,
        maxLength: maxLength(50),
    },
    category: {
        required,
        maxLength: maxLength(20),
    },
    price: {
        required,
        numeric,
    },
}