
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Card, CardContent } from "../ui/card"



const CustomCarousel = () => {

  return (
    <Carousel
      dir="ltr"
      className="w-full sm:max-w-xs"
      opts={{
        direction: "ltr",
      }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card dir="ltr">
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-4xl font-semibold">
                    slide:{index}
                  </span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default CustomCarousel