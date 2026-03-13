import { Button } from "@/components/ui/button"
import { useRegisterMutation } from "@/redux/services/authApi"
import { Link } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CustomInput } from "@/customComponent/input"
import { Form } from "@/components/ui/form"
import { CustomSelect } from "@/customComponent/select"

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "others", label: "Others" },
]

const registerFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  fullname: z.string().min(1, "Full name is required"),
  gender: z.string(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const Register = () => {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
    defaultValues: {
      username: "",
      fullname: "",
      gender: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const [register, { isLoading }] = useRegisterMutation()

  const onRegisterFormSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    await register(values)
    form.reset()
  }
  return (
    <div className="max-w-sm w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onRegisterFormSubmit)}>
          <div className="flex flex-col">
             <h1 className="text-3xl font-bold pb-3.5">Register</h1>
            <CustomInput control={form.control} name="username" label="Username" />
            <CustomInput control={form.control} name="fullname" label="Full Name" />
            <CustomSelect control={form.control} name="gender" label="Gender" options={genderOptions} />
            <CustomInput control={form.control} name="email" label="Email" />
            <CustomInput control={form.control} name="password" label="Password" type="password" />
            <CustomInput control={form.control} name="confirmPassword" label="Confirm Password" type="password" />
            <Button
              className="w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit">
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </Form>
      <div>
        <p className="text-sm text-center mt-4"><span>Already have an account? <Link to="/auth/login" className="text-blue-500">Login</Link></span></p>
      </div>
    </div>

  )
}

export default Register
