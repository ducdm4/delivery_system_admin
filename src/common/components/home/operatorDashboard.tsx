import { TabView, TabPanel } from 'primereact/tabview';
import OperatorOrderNewlyCreate from './operatorDashboardComps/operatorOrderNewlyCreate';
import OperatorOrderOnTheWay from './operatorDashboardComps/operatorOrderOnTheWay';

const OperatorDashboard = () => {
  return (
    <>
      <TabView className="mt-6">
        <TabPanel header="Newly created">
          <OperatorOrderNewlyCreate />
        </TabPanel>
        <TabPanel header="On the way to station">
          <OperatorOrderOnTheWay />
        </TabPanel>
      </TabView>
    </>
  );
};

export default OperatorDashboard;
