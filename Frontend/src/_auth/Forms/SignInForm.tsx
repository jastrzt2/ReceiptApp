import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignInValidation } from '@/lib/validation/validation';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'; 
import { ILoginUser } from '@/types'; 
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const SignInForm = () => {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const { checkAuthUser } = useUserContext();
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { handleSubmit } = form;

    const { mutateAsync: signInUser, isPending: isSigningIn } = useSignInAccount();

    const onSubmit = async (data: z.infer<typeof SignInValidation>) => {
        const user: ILoginUser = {
            email: data.email,
            password: data.password,
        };

        try {
            setFormErrors([]);
            await signInUser(user);
            console.log('Correct password');
            const isLoggedIn = await checkAuthUser();

            if (isLoggedIn) {
                form.reset();
                navigate('/');
              } else {
                toast({
                  title: "Sign in failed. Please try again.",
                  duration: 5000,
                });
                navigate('/signin');
              }

        } catch (error) {
            console.error('Error signing in user:', error);
            const newErrors: string[] = [];

            if (error instanceof Error) {
                const errorMessage = error.message;
                newErrors.push(errorMessage);
            }

            setFormErrors(newErrors);
        }
    };

    return (
        <Form {...form}>
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md flex flex-col items-center">
                    <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Sign in to your account</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="shad-input text-black" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red" />
                                </FormItem>
                            )}
                        />

                        {formErrors.length > 0 && (
                            <div className="text-rose-700 text-sm mb-4">
                                {formErrors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
                        <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-light-1 flex gap-2">
                            {isSigningIn ? (
                                <div className="flex-center gap-2">
                                    <Loader />
                                </div>
                            ) : "Sign In"}
                        </Button>
                        <p className="text-small-red text-light-2 text-center mt-2">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-primary-500 text-small-semibold ml-1">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </Form>
    );
};

export default SignInForm;
