export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/outils',
      permanent: true,
    },
  };
}

export default function FrOutils() {
  return null;
}
