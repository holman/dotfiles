"""Returns the neighbour focus group for the current window."""
def other_group_in_pair(window):
  if window.active_group() % 2 == 0:
    target_group = window.active_group()+1
  else:
    target_group = window.active_group()-1
  return min(target_group, window.num_groups()-1)
