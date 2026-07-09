import DecisionPage from '../../components/DecisionPage';
import { getDecisionPageStaticProps } from '../../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('meilleurs-outils-ia-pour-etudiants');
}

export default DecisionPage;
