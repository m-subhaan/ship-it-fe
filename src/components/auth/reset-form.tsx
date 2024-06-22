'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  password: zod.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: zod.string(),
});

type Values = zod.infer<typeof schema>;
interface ResetFormProps {
  userId: string;
}

const defaultValues = { password: '', confirmPassword: '' };

export function ResetForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { password, confirmPassword } = values;

      if (password !== confirmPassword) {
        setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
        setIsPending(false);
        return;
      }

      //   const token = userid;
      const userId = searchParams.get('userId');

      try {
        if (userId) {
          await authClient.confirmPasswordChange({ userId, password, confirmPassword });
          // Redirect to sign-in page after successful password change
          router.push(paths.auth.signIn);
        }
      } catch (error: any) {
        setError('root', { type: 'server', message: error.message });
        setIsPending(false);
      }
    },
    [setError, router]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>New password</InputLabel>
                <OutlinedInput {...field} label="New password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Confirm new password</InputLabel>
                <OutlinedInput {...field} label="Confirm new password" type="password" />
                {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
