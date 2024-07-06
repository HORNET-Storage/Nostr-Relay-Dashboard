import { useState } from 'react';
import { notificationController } from '@app/controllers/notificationController';
import config from '@app/config/config';

interface SignUpFormData {
  npub: string;
  password: string;
  termOfUse: boolean;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (signUpData: SignUpFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.baseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        notificationController.error({ message: errorData.error });
        throw new Error(errorData.error);
      }

      notificationController.success({
        message: 'Sign-up successful',
        description: 'You have successfully signed up!',
      });
    } catch (error: any) {
      notificationController.error({ message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};

// import { useState } from 'react';
// import { notificationController } from '@app/controllers/notificationController';

// interface SignUpFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
// }

// export const useSignUp = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const signUp = async (signUpData: SignUpFormData) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(signUpData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         notificationController.error({ message: errorData.error });
//         throw new Error(errorData.error);
//       }

//       notificationController.success({
//         message: 'Sign-up successful',
//         description: 'You have successfully signed up!',
//       });
//     } catch (error: any) {
//       notificationController.error({ message: error.message });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { signUp, isLoading };
// };
