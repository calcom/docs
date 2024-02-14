import { Button } from "@/components/ui/button"

export const CTA = ({ label, href }) => {
  return <div className="mt-12">
      <Button href={href} size="sm" variant="pill">{ label } →</Button>
    </div>
}