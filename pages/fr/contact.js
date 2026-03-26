export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/contact',
      permanent: true,
    },
  };
}

export default function FrContact() {
  return null;
}
