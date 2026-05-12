import numpy as np
from scipy.linalg import solve_continuous_are

# Cartpole parameters
M = 1.0
m = 0.1
l = 0.5
g = 9.81

# Linearized system matrices
denom = M + m
D = l * (4.0/3.0 - m / denom)

B3 = -1.0 / (D * denom)
A32 = g / D
A12 = -m * l * A32 / denom
B1 = 1.0 / denom - m * l * B3 / denom

A = np.array([
    [0, 1, 0, 0],
    [0, 0, A12, 0],
    [0, 0, 0, 1],
    [0, 0, A32, 0]
])

B = np.array([
    [0],
    [B1],
    [0],
    [B3]
])

Q = np.diag([1.0, 1.0, 10.0, 10.0])
R = np.array([[0.1]])

P = solve_continuous_are(A, B, Q, R)
K = np.linalg.inv(R) @ B.T @ P

print("Optimal K:", K)
