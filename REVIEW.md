# Guia de Review - DevPortal Frontend

## Critérios de Aprovação

### Obrigatórios
1. **Lint limpo**: `npm run lint` sem erros
2. **Build compila**: `npm run build` sem falhas
3. **Tipos corretos**: Sem uso de `any` ou `@ts-ignore`
4. **Segurança**: Nenhum secret exposto no código
5. **Acessibilidade**: Labels em formulários, alt em imagens

### Recomendados
1. **Componentes reutilizáveis**: Evitar duplicação de código
2. **Validação com Zod**: Toda entrada de usuário validada
3. **Tratamento de erros**: Feedback visual em caso de falha
4. **Loading states**: Skeleton ou spinner durante carregamento
5. **Responsividade**: Funcionar em mobile e desktop

## Checklist de Review

- [ ] Mudanças estão dentro do escopo do PR
- [ ] Nenhum arquivo de configuração sensível foi alterado
- [ ] Novos componentes seguem padrão existente
- [ ] Imports organizados (sem imports não utilizados)
- [ ] Textos em português (BR) para interface do usuário
