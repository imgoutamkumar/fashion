import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileUpload } from '@/customComponent/fileupload'
import { CustomInput } from '@/customComponent/input'
import { MultiLevelSelect } from '@/customComponent/MultilevelSelect'
import { CustomRadioButton } from '@/customComponent/radiobutton'
import { CustomSelect } from '@/customComponent/select'
import { CustomTextarea } from '@/customComponent/textarea'
import { buildTree } from '@/helper/commonFunction'
import { useCreateBrandMutation, useGetBrandsQuery } from '@/redux/services/brandApi'
import { useCreateCategoryMutation, useGetCategoriesQuery } from '@/redux/services/categoryApi'
import { useCreateProductMutation } from '@/redux/services/productApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, Trash2, UploadCloud, X } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from "zod"

const currencyOptions = [
    { value: "INR", label: "Indian Rupee" },
    { value: "USD", label: "US Dollar" },
    { value: "EUR", label: "Euro" },
]
const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
]

const codAvailableOptions = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
]

const returnnableOptions = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
]


const attributeValueOptions = [
    { value: "550e8400-e29b-41d4-a716-446655440000", label: "M" },
    { value: "6fa459ea-ee8a-4ca4-894e-db77e160355e", label: "L" },
    { value: "c3c86e2f-a495-42f6-be16-d9d3b8395d30", label: "Red" },
    { value: "c1a9b8d7-1234-4abc-9def-567890abcdef", label: "Blue" },
]

const attributeSchema = z.object({
    type: z.string().min(1, "Attribute type required"), // size,color
    value_id: z.string().uuid("Select value") // UUID from backend
})

const variantSchema = z.object({
    sku: z.string().min(1, "SKU is required"),
    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    discount_percent: z.string().optional(),
    is_default: z.string().optional(),
    // attribute_value_ids: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional(),
    attributes: z.array(attributeSchema).min(1, "Add at least one attribute"),
})
const newProductFormSchema = z.object({
    productname: z.string().min(3, "Product name must be at least 3 characters long"),
    brand_id: z.string().min(1, "Brand name is required"),
    category_id: z.string().min(1, "Category is required"),
    currency: z.string().default("INR"),
    status: z.string().default("draft"),
    is_returnable: z.string().default("true"),
    is_cod_available: z.string().default("true"),
    description: z.string().optional(),
    short_description: z.string().optional(),
    // Array of variants
    variants: z.array(variantSchema).min(1, "At least one variant is required")
})

const Steps = [
    { id: "1", name: "Basic Details" },
    { id: "2", name: "Variants Details" },
]

const NewProduct = () => {
    const [currentStep, setCurrentStep] = useState(1)
    type NewProductFormInput = z.input<typeof newProductFormSchema>
    type NewProductFormOutput = z.output<typeof newProductFormSchema>
    const [createProduct, { isLoading }] = useCreateProductMutation()
    const [createBrand, { isLoading: isBrandCreating }] = useCreateBrandMutation()
    const [createCategory, { isLoading: isCategoryCreating }] = useCreateCategoryMutation()
    const { data: categories, isLoading: isCategoryLoading } = useGetCategoriesQuery()
    const { data: brands, isLoading: isBrandLoading } = useGetBrandsQuery()

    console.log("Categories:", categories)
    console.log("Brands:", brands)
    const brandOptions = brands?.data?.map((brand: any) => ({ value: brand?.ID, label: brand?.Name })) || []
    // const categoryOptions = categories?.data?.map((category) => ({ value: category?.id, label: category?.Name })) || []
    const categoryTree = buildTree(categories?.data)
    console.log("categoryTree", categoryTree)
    const form = useForm<NewProductFormInput>({
        resolver: zodResolver(newProductFormSchema),
        mode: "onTouched",
        defaultValues: {
            productname: "",
            brand_id: "",
            category_id: "",
            currency: "INR",
            status: "draft",
            variants: [
                {
                    sku: "",
                    price: "",
                    stock: "",
                    images: [],
                    attributes: [{ type: "", value_id: "" }]

                }
            ]
        },
    })


    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'variants'
    })

    const buildProductFormData = (
        values: z.infer<typeof newProductFormSchema>
    ) => {
        console.log("FINAL VALUES:", values)

        const formData = new FormData()

        // ---------------- PRODUCT ----------------
        formData.append("productname", values.productname)
        formData.append("brand_id", values.brand_id)
        formData.append("category_id", values.category_id)
        formData.append("currency", values.currency)
        formData.append("status", values.status)

        if (values.description)
            formData.append("description", values.description)

        if (values.short_description)
            formData.append("short_description", values.short_description)

        if (values.is_returnable)
            formData.append("is_returnable", values.is_returnable)

        if (values.is_cod_available)
            formData.append("is_cod_available", values.is_cod_available)

        // ---------------- VARIANTS JSON ----------------
        const variantPayload = values.variants.map((v, index) => ({
            sku: v.sku,
            price: Number(v.price),
            stock: Number(v.stock),
            discount_percent: Number(v.discount_percent || 0),
            is_default: v.is_default || false,

            // IMPORTANT: send only attribute_value_ids
            attribute_value_ids: v.attributes.map(a => a.value_id)
        }))

        formData.append("variants", JSON.stringify(variantPayload))

        // ---------------- VARIANT IMAGES ----------------
        values.variants.forEach((variant, vIndex) => {
            if (variant.images?.length) {
                variant.images.forEach((file: File) => {
                    formData.append(`variant_images_${vIndex}`, file)
                })
            }
        })

        return formData
    }


    const onNewProductFormSubmit = async (
        values: z.input<typeof newProductFormSchema>
    ) => {
        console.log("FORM VALUES:", values)

        const parsedValues: NewProductFormOutput =
            newProductFormSchema.parse(values)

        const formData = buildProductFormData(parsedValues)
        console.log("formData", formData)
        await createProduct(formData)
    }

    // Navigation handlers
    const handleNext = () => {
        if (currentStep < Steps.length) setCurrentStep((prev) => prev + 1)
    }

    const handlePrevious = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1)
    }

    return (
        <div className='w-full h-full flex flex-col p-4 '>
            <h3 className='text-2xl font-bold pb-4'>Create New Product</h3>

            <Card>
                <CardHeader>
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Step {currentStep} of {Steps?.length}</CardDescription>

                    {/* Stepper Indicator */}
                    <div className="flex justify-around mt-4 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-10"
                            style={{ width: `${((currentStep - 1) / (Steps.length - 1)) * 100}%` }}
                        ></div>

                        {Steps?.map((step: any) => (
                            <div
                                key={step?.id}
                                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${currentStep >= step.id
                                    ? "bg-[#2d72e8] border-primary text-primary-foreground"
                                    : "bg-background border-slate-300 text-slate-500"
                                    }`}
                            >
                                {step?.id}
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <Form {...form}>
                        <form
                            id="product-form"
                            className="flex flex-col w-full gap-4"
                            onSubmit={form.handleSubmit(onNewProductFormSubmit)}
                        >
                            {currentStep === 1 && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                                        <CustomInput control={form.control} name="productname" label="Product Name" />
                                        <CustomSelect control={form.control} name="brand_id" label="Brands" options={brandOptions} isLoading={isBrandLoading} />
                                        {/* <CustomSelect control={form.control} name="category_id" label="Category" options={categoryOptions} isLoading={isCategoryLoading} /> */}
                                        <MultiLevelSelect tree={categoryTree} onChange={(val) => form.setValue("category_id", val)} title="Select Category" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                                        <CustomInput control={form.control} name="description" label="Description" />
                                        <CustomSelect control={form.control} name="currency" label="Currency" options={currencyOptions} />
                                        <CustomSelect control={form.control} name="status" label="Status" options={statusOptions} />
                                    </div>
                                    <CustomTextarea
                                        control={form.control}
                                        name="short_description"
                                        label="Short Description"
                                        height='60px'
                                    />
                                    <CustomTextarea
                                        control={form.control}
                                        name="description"
                                        label="Description"
                                    />
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    {
                                        fields.map((field, index) => (
                                            <VariantItem
                                                key={field?.id}
                                                control={form.control}
                                                index={index}
                                                remove={remove}
                                                setValue={form.setValue}
                                            />
                                        ))}

                                    < Button
                                        type="button"
                                        onClick={() => append({
                                            sku: '',
                                            price: '',
                                            stock: '',
                                            attributes: [{ type: '', value_id: '' }],
                                            images: []
                                        })}
                                    >
                                        + Add Variant
                                    </Button>
                                </>
                            )
                            }

                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        type='button'
                    >
                        Previous
                    </Button>

                    {currentStep < Steps.length ? (
                        <Button type='button' onClick={handleNext}>Next</Button>
                    ) : (
                        <Button
                            form="product-form"
                            className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed w-fit"
                            // disabled={!form.formState.isValid || isLoading}
                            type="submit">
                            {isLoading ? "Creating..." : "Create Product"}
                        </Button>
                    )}
                </CardFooter>
            </Card >

            <div className='flex justify-end my-2'>

            </div>

        </div >
    )

}

const VariantItem = ({ control, index, remove, setValue }) => {
    const { fields, append, remove: removeAttr } = useFieldArray({
        control,
        name: `variants.${index}.attributes`
    })

    return (
        <Card className="border-2 border-dashed">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-bold">
                    Variant {index + 1}
                </CardTitle>

                <Button
                    className='cursor-pointer'
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* price stock sku */}
                <div className="grid grid-cols-3 gap-4 items-start">
                    <CustomInput
                        control={control}
                        name={`variants.${index}.price`}
                        label="Price"
                    />

                    <CustomInput
                        control={control}
                        name={`variants.${index}.stock`}
                        label="Stock"
                    />

                    <CustomInput
                        control={control}
                        name={`variants.${index}.sku`}
                        label="SKU"
                    />
                </div>
                <div>
                    {fields.map((attr, i) => (
                        <div key={attr.id} className="relative grid grid-cols-3 gap-3">
                            <CustomSelect
                                control={control}
                                name={`variants.${index}.attributes.${i}.type`}
                                label="Type"
                                options={[
                                    { value: 'size', label: 'Size' },
                                    { value: 'color', label: 'Color' }
                                ]}
                            />

                            <CustomSelect
                                control={control}
                                name={`variants.${index}.attributes.${i}.value_id`}
                                label="Value ID"
                                options={attributeValueOptions}
                            />

                            <Button variant="destructive" onClick={() => removeAttr(i)} className='absolute right-0 top-0 size-6 rounded-full cursor-pointer'>
                                <X size={14} />
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        onClick={() => append({ type: '', value_id: '' })}
                    >
                        + Add Attribute
                    </Button>
                </div>

                {/* IMAGES */}
                <div>
                    <label className="text-sm font-bold">Variant Images</label>

                    <FileUpload
                        multiple
                        accept="image/*"
                        onChange={(files) => {
                            setValue(`variants.${index}.images`, files, { shouldDirty: true })
                        }}
                    />
                </div>

            </CardContent>
        </Card>

    )
}

export default NewProduct
