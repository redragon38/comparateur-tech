export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: true, // 301 — /fr/ est un alias permanent de /
    },
  };
}

export default function FrIndex() {
  return null;
}
