export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/contact',
      permanent: false,
    },
  };
}

export default function EnContact() {
  return null;
}
