import { TabView, TabPanel } from 'primereact/tabview';
import OperatorOrderNewlyCreate from './operatorOrderNewlyCreate';
import OperatorOrderOnTheWay from './operatorOrderOnTheWay';

const OperatorDashboard = () => {
  return (
    <>
      <TabView className="mt-6">
        <TabPanel header="Newly created orders">
          <OperatorOrderNewlyCreate />
        </TabPanel>
        <TabPanel header="Order on the way to station">
          <OperatorOrderOnTheWay />
        </TabPanel>
      </TabView>
    </>
  );
};

export default OperatorDashboard;
