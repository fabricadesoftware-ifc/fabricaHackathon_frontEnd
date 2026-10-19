import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  mockEvaluationProjects,
  type EvaluationProject,
} from '@/data/evaluationProjects'

export interface CriterionScore {
  criterionId: number
  score: number
  comment: string
}

export interface ProjectEvaluation {
  editionId: number
  projectId: number
  evaluatorId: number
  criteria: CriterionScore[]
  finalScore: number
  createdAt: string
}

const STORAGE_KEY = 'hackifc-evaluations-v1'

// Avaliador fictício até a integração com o login.
export const MOCK_EVALUATOR_ID = 1

function loadEvaluations(): ProjectEvaluation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) return []

    const parsed: unknown = JSON.parse(saved)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const useEvaluationsStore = defineStore('evaluations', () => {
  const evaluations = ref<ProjectEvaluation[]>(loadEvaluations())

  const projects = computed(() => mockEvaluationProjects)

  function getEvaluation(
    editionId: number,
    projectId: number,
    evaluatorId = MOCK_EVALUATOR_ID,
  ) {
    return evaluations.value.find(
      evaluation =>
        evaluation.editionId === editionId &&
        evaluation.projectId === projectId &&
        evaluation.evaluatorId === evaluatorId,
    )
  }

  function getProject(
    editionId: number,
    projectId: number,
  ): EvaluationProject | undefined {
    return projects.value.find(
      project =>
        project.editionId === editionId &&
        project.id === projectId,
    )
  }

  function getProjectsByEdition(
    editionId: number,
    evaluatorId = MOCK_EVALUATOR_ID,
  ): EvaluationProject[] {
    return projects.value
      .filter(project => project.editionId === editionId)
      .map(project => {
        const evaluation = getEvaluation(
          editionId,
          project.id,
          evaluatorId,
        )

        if (!evaluation) return { ...project }

        return {
          ...project,
          status: 'avaliado',
          score: evaluation.finalScore,
        }
      })
  }

  function getEditionProgress(
    editionId: number,
    evaluatorId = MOCK_EVALUATOR_ID,
  ) {
    const editionProjects = getProjectsByEdition(
      editionId,
      evaluatorId,
    )

    return {
      total: editionProjects.length,
      evaluated: editionProjects.filter(
        project => project.status === 'avaliado',
      ).length,
      pending: editionProjects.filter(
        project => project.status === 'pendente',
      ).length,
    }
  }

  function submitEvaluation(payload: {
    editionId: number
    projectId: number
    evaluatorId: number
    criteria: CriterionScore[]
  }): ProjectEvaluation {
    const {
      editionId,
      projectId,
      evaluatorId,
      criteria,
    } = payload

    const project = getProject(editionId, projectId)

    if (!project) {
      throw new Error('Projeto não encontrado nesta edição.')
    }

    if (
      project.status === 'avaliado' ||
      getEvaluation(editionId, projectId, evaluatorId)
    ) {
      throw new Error('Você já avaliou este projeto.')
    }

    if (
      criteria.length === 0 ||
      new Set(criteria.map(item => item.criterionId)).size !== criteria.length ||
      criteria.some(item =>
        !Number.isFinite(item.score) ||
        item.score < 0 ||
        item.score > 10
      )
    ) {
      throw new Error('Preencha todos os critérios corretamente.')
    }

    const total = criteria.reduce(
      (sum, item) => sum + item.score,
      0,
    )

    const evaluation: ProjectEvaluation = {
      editionId,
      projectId,
      evaluatorId,
      criteria: criteria.map(item => ({ ...item })),
      finalScore: total / criteria.length,
      createdAt: new Date().toISOString(),
    }

    const updated = [...evaluations.value, evaluation]

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    evaluations.value = updated

    return evaluation
  }

  return {
    evaluations,
    projects,
    getEvaluation,
    getProject,
    getProjectsByEdition,
    getEditionProgress,
    submitEvaluation,
  }
})