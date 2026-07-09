import DecisionPage from '../../components/DecisionPage';
import { getDecisionPageStaticProps } from '../../lib/decision-page-props';

export async function getStaticProps() {
  return getDecisionPageStaticProps('meilleure-api-ia');
}

export default DecisionPage;
