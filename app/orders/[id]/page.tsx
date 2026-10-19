import OrderDetails from "@/components/orders/OrderDetails";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const { id } = await params;

  return <OrderDetails orderId={Number(id)} />;
}