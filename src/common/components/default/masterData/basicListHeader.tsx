import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

interface Props {
  title: string;
  smallTitle: string;
  addButton: {
    label: string;
    url: string;
  };
}

const basicListHeader = (props: Props) => {
  const router = useRouter();
  async function goToAdd() {
    await router.push(props.addButton.url);
  }

  return (
    <div className="rounded-none p-4">
      <div className="flex items-center justify-between gap-8">
        <div>
          <p className={'text-xl font-bold'}>{props.title}</p>
          <p className={'text-sm'}>{props.smallTitle}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button
            className="flex items-center gap-3"
            color="blue"
            onClick={goToAdd}
            size="small"
            severity="info"
            icon="pi pi-plus"
            label={props.addButton.label}
          />
        </div>
      </div>
    </div>
  );
};

export default basicListHeader;
