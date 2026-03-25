export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/outils',
      permanent: false,
    },
  };
}

export default function EnOutils() {
  return null;
}
