import styled from "styled-components";

export const BackDrop = styled.div`
	position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
	visibility: ${({ dropdown }) => (dropdown ? "" : "hidden")};
	}`;

export const Title = styled.li`
    font-size: 17px;
    background-color: var(--main-color);
    color: black;
    cursor: pointer;
`;
