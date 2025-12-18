import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../../utils/input/InputField";

const RoleComponent: React.FC = () => {
  return (
    <div>
      <ComponentCard title="Form Service">
        <div className="space-y-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <Label htmlFor="input">Service Name</Label>
            <Input type="text" placeholder="Enter service name" id="input" />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};
export default RoleComponent;
